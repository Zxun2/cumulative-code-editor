import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../components/state";

export const useActions = () => {
  const dispatch = useDispatch();

  return bindActionCreators(actionCreators, dispatch);
};