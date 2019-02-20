import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import View from '../../components/view';
import Prompt from '../../components/prompt';
import Controls from '../../components/controls';
import Confetti from '../../components/confetti';
import Loading from '../../components/loading';
import { InputAddress, PayInvoice, LockingFunds } from './steps';
import BackGround from '../../components/background';
import StepsWizard from '../../components/stepswizard';
import { getCurrencyName } from '../../scripts/utils';

const styles = () => ({
  wrapper: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ReverseSwap = ({
  classes,
  setReverseSwapAddress,
  startReverseSwap,
  completeSwap,
  goHome,
  webln,
  swapFailResponse,
  swapInfo,
  swapResponse,
  isFetching,
  swapStatus,
}) => {
  return (
    <BackGround>
      <Prompt />
      <View className={classes.wrapper}>
        <StepsWizard
          range={4}
          stage={1}
          id={swapResponse ? swapResponse.id : null}
          onExit={() => {
            if (window.confirm('Are you sure you want to exit')) {
              completeSwap();
              goHome();
            }
          }}
        >
          <StepsWizard.Steps>
            <StepsWizard.Step
              num={1}
              render={() => (
                <InputAddress
                  swapInfo={swapInfo}
                  onChange={setReverseSwapAddress}
                />
              )}
            />
            <StepsWizard.Step
              num={2}
              render={() => (
                <LockingFunds swapInfo={swapInfo} swapResponse={swapResponse} />
              )}
            />
            <StepsWizard.Step
              num={3}
              render={() => (
                <PayInvoice
                  asset={swapInfo.base}
                  invoice={swapResponse.invoice}
                  webln={webln}
                />
              )}
            />
            <StepsWizard.Step num={4} render={() => <Confetti />} />
          </StepsWizard.Steps>
          <StepsWizard.Controls>
            <StepsWizard.Control
              num={1}
              render={props => (
                <Controls
                  loading={!swapInfo.address}
                  text={'Next'}
                  loadingText={`Input a ${getCurrencyName(
                    swapInfo.quote
                  )} address`}
                  loadingRender={() => undefined}
                  onPress={() => {
                    if (swapInfo.address && swapInfo.address !== '') {
                      startReverseSwap(swapInfo, props.nextStage);
                      props.nextStage();
                    }
                  }}
                />
              )}
            />
            <StepsWizard.Control
              num={2}
              render={props => (
                <Controls
                  loading={isFetching}
                  loadingText={'Locking your funds...'}
                  loadingRender={() => <Loading />}
                  error={swapFailResponse === true}
                  errorAction={() =>
                    startReverseSwap(swapInfo, props.nextStage)
                  }
                  errorText={`Reverse swap failed`}
                />
              )}
            />
            <StepsWizard.Control
              num={3}
              render={() => (
                <Controls
                  loading={isFetching}
                  loadingText={swapStatus}
                  loadingRender={() => <Loading />}
                />
              )}
            />
            <StepsWizard.Control
              num={4}
              render={() => (
                <Controls
                  text={'Swap Again!'}
                  onPress={() => {
                    completeSwap();
                    goHome();
                  }}
                />
              )}
            />
          </StepsWizard.Controls>
        </StepsWizard>
      </View>
    </BackGround>
  );
};

ReverseSwap.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  goHome: PropTypes.func.isRequired,
  webln: PropTypes.object,
  swapInfo: PropTypes.object,
  swapResponse: PropTypes.object,
  swapFailResponse: PropTypes.bool.isRequired,
  completeSwap: PropTypes.func,
  setReverseSwapAddress: PropTypes.func,
  onExit: PropTypes.func,
  nextStage: PropTypes.func,
  startReverseSwap: PropTypes.func.isRequired,
  swapStatus: PropTypes.string.isRequired,
};

export default injectSheet(styles)(ReverseSwap);
