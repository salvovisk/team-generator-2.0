import { createState, useState } from "@hookstate/core";
import AsyncStorage from "@react-native-async-storage/async-storage";

const setInitial = async () => {
  const savedPlayers = await AsyncStorage.getItem("@storage_SavedPlayers");
  const parsedSaved = JSON.parse(savedPlayers);
  if (savedPlayers !== null) {
    //console.log(parsedSaved);
    return parsedSaved;
  } else return [];
};
const playersState = createState(setInitial());

const teamsState = createState([]);

const setItem = async (value) => {
  return await AsyncStorage.setItem(
    "@storage_SavedPlayers",
    JSON.stringify(value)
  );
};

const storeData = async (value) => {
  let Arr = [];
  const cleanArray = () => {
    return (Arr = []);
  };
  try {
    //checking if there are saved players already in the storage
    const savedPlayers = await AsyncStorage.getItem("@storage_SavedPlayers");
    const parsedSaved = JSON.parse(savedPlayers);

    // if there are
    if (savedPlayers !== null) {
      //
      // checking if the player is already saved
      if (parsedSaved.find((p) => p.id === value.id)) {
        // if it is already in the storage we need to remove it as the save functions as a toggle
        const playersFiltered = parsedSaved.filter(
          (player) => player.id !== value.id
        );
        Arr.push(...playersFiltered);
        //console.log(playersFiltered);
        setItem(Arr);
        cleanArray();
        //
      } else {
        Arr.push(...parsedSaved, value);
        setItem(Arr);
        cleanArray();
      }
    } else {
      Arr.push(value);
      setItem(Arr);
      cleanArray();
    }
  } catch (error) {
    console.log(error);
  }
};

export function usePlayersState() {
  const state = useState(playersState);

  return {
    addPlayer(newPlayer) {
      return state.merge([newPlayer]);
    },
    removePlayer(id) {
      return state.set((players) =>
        players.filter((player) => player.id !== id)
      );
    },
    lockPlayer(id) {
      if (id) {
        const index = state.findIndex((player) => player.value.id == id);
        return (
          state[index].set((player) => ({
            ...player,
            isSaved: !player.isSaved,
          })),
          storeData(state[index].value)
        );
      }
    },
    getKeys() {
      return state.keys;
    },
    getPlayers() {
      return state.get();
    },
  };
}

export function useTeamsState() {
  const state = useState(teamsState);
  const playersState = usePlayersState();
  const players = playersState.getPlayers();
  return {
    generateTeams() {
      let Arr = [];
      Arr.push(...players);
      let shuffledPlayers = Arr.sort(() => Math.random() - 0.5);
      const chunkArray = (myArray, divider) => {
        let i = 0;
        let arrayLen = myArray.length;
        let tempArray = [];
        for (i = 0; i < arrayLen; i += divider) {
          let divide = myArray.slice(i, i + divider);
          tempArray.push(divide);
        }
        return state.set([...tempArray]);
      };
      switch (players.length) {
        case 5:
          {
            chunkArray(shuffledPlayers, 3);
          }
          break;
        case 6:
          {
            chunkArray(shuffledPlayers, 3);
          }
          break;
        case 7:
          {
            chunkArray(shuffledPlayers, 4);
          }
          break;
        case 8:
          {
            chunkArray(shuffledPlayers, 4);
          }
          break;
        case 9:
          {
            chunkArray(shuffledPlayers, 3);
          }
          break;
        case 10:
          {
            chunkArray(shuffledPlayers, 4);
          }
          break;
        case 11:
          {
            chunkArray(shuffledPlayers, 4);
          }
          break;
        default:
          chunkArray(shuffledPlayers, 3);
      }
    },
    resetTeams() {
      return state.set();
    },
    getTeams() {
      return state.get();
    },
  };
}
