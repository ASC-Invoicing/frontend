import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface ActiveOrgState {
  currentOrg: any;
  slug: string | null;
  name: string | null;
}

const initialState: ActiveOrgState = {
    slug: null,
    name: null,
    currentOrg: undefined
};

const orgContextSlice = createSlice({
  name: "orgContext",
  initialState,
  reducers: {
    setActiveOrg(state, action: PayloadAction<{ slug: string; name: string }>) {
      state.slug = action.payload.slug;
      state.name = action.payload.name;
    },
    clearActiveOrg(state) {
      state.slug = null;
      state.name = null;
    },
  },
});

export const { setActiveOrg, clearActiveOrg } = orgContextSlice.actions;
export default orgContextSlice.reducer;
