const I_SIMULATION_START = 0;
const I_SIMULATION_PAUSE = 1;
const I_UPDATE = 2;
const I_RESIZE = 3;
const I_UPDATE_GRID = 4;

function Msg(intent, data) {
    return {
        intent: intent,
        data: data
    }
}