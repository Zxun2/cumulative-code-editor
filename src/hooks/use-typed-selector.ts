import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../components/state";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
