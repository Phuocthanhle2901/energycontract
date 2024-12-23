import { createSlice } from "@reduxjs/toolkit";

interface ILogin {
  username: string;
  password: string;
  rememberMe: boolean;
}

const initialState: {
  rememberLogin: ILogin;
} = {
  rememberLogin: {
    username: "",
    password: "",
    rememberMe: true,
  },
};

export const appSlice = createSlice({
  name: "rememberLogin",
  initialState,
  reducers: {
    saveData: (state, action) => {
      state.rememberLogin = action.payload;
    },
    updateUsername: (state, action) => {
      state.rememberLogin = {
        ...state.rememberLogin,
        username: action.payload,
      };
    },
    updatePassword: (state, action) => {
      state.rememberLogin = {
        ...state.rememberLogin,
        password: action.payload,
      };
    },
    updateRememberMe: (state, action) => {
      state.rememberLogin = {
        ...state.rememberLogin,
        rememberMe: action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveData, updateUsername, updatePassword, updateRememberMe } =
  appSlice.actions;

export default appSlice.reducer;
