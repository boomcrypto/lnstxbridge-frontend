import { connect } from 'react-redux';
import {
  startSwap,
  completeSwap,
  setSwapInvoice,
  claimSwap,
  continueSwap,
} from '../../actions/swapActions';
import Swap from './swap';

const mapStateToProps = state => ({
  webln: state.swapReducer.webln,
  swapInfo: state.swapReducer.swapInfo,
  swapResponse: state.swapReducer.swapResponse.response,
  retrySwap: state.swapReducer.retry,
  swapStatus: state.swapReducer.swapStatus,
  inSwapMode: state.swapReducer.inSwapMode,
});

const mapDispatchToProps = dispatch => ({
  setSwapInvoice: (invoice, error) => dispatch(setSwapInvoice(invoice, error)),
  completeSwap: () => dispatch(completeSwap()),
  startSwap: (info, cb) => dispatch(startSwap(info, cb)),
  claimSwap: (nextStage, swapInfo, swapResponse, swapStatus) =>
    claimSwap(dispatch, nextStage, swapInfo, swapResponse, swapStatus),
  continueSwap: (swapData, nextStage, cb) =>
    dispatch(continueSwap(swapData, nextStage, cb)),
  // completeSwap: () => dispatch(completeReverseSwap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
