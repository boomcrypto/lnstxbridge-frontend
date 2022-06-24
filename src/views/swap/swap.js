import React, { Component } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import View from '../../components/view';
import Prompt from '../../components/prompt';
import Loading from '../../components/loading';
import Controls from '../../components/controls';
import Confetti from '../../components/confetti';
import BackGround from '../../components/background';
import StepsWizard from '../../components/stepswizard';
import { InputInvoice, SendTransaction, DownloadRefund } from './steps';
import { navigation } from '../../actions';
import { Link, Paper, Typography } from '@mui/material';
import { CheckCircle, Lock } from '@mui/icons-material';

const styles = theme => ({
  wrapper: {
    flex: '1 0 100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackscolor: {
    backgroundColor: 'rgba(85,70,255,1)',
  },
});

class Swap extends Component {
  componentDidMount = () => {
    this.redirectIfLoggedOut();
  };

  componentDidUpdate = () => {
    this.redirectIfLoggedOut();
  };

  componentWillUnmount = () => {
    console.log('swap.37 componentWillUnmount ', this.props);
    this.props.completeSwap();
  };

  redirectIfLoggedOut = () => {
    // check if continuing from local
    if (this.props?.location?.search?.includes('?swapId=')) {
      const swapId = this.props?.location?.search.split('?swapId=')[1];
      console.log('swap.44 continue swapId ', swapId);
    } else if (!this.props.inSwapMode) {
      console.log('swap.43 this.props.inSwapMode ', this.props);
      navigation.navHome();
    }
  };

  onExit = () => {
    if (window.confirm('Are you sure you want to exit')) {
      this.props.completeSwap();
      navigation.navHome();
    }
  };

  startSwap = cb => {
    // console.log('swap.js startswap ', this.props);
    if (this.props.swapInfo.invoice && this.props.retrySwap) {
      this.props.startSwap(this.props.swapInfo, cb);
    }
  };

  completeSwap = () => {
    console.log('swap.61 completeSwap ');
    this.props.completeSwap();

    window.onbeforeunload = () => {};
    window.location.reload();
  };

  claimSwap = () => {
    this.props.claimSwap();
  };

  render() {
    let {
      classes,
      webln,
      setSwapInvoice,
      swapInfo,
      swapResponse,
      swapStatus,
      claimSwap,
      continueSwap,
    } = this.props;
    console.log('swap.js 74 ', swapInfo, swapStatus, continueSwap);
    console.log('swap.js 90 ', this.props);

    // update props if continuing swap
    if (
      this.props?.location?.search?.includes('?swapId=') &&
      !swapInfo.type &&
      !swapResponse
    ) {
      try {
        if (!window.location.href.includes('?')) return;
        const swapId = window.location.href.split('?swapId=')[1];
        if (!localStorage['lnswaps_' + swapId]) return;
        const swapData = JSON.parse(localStorage['lnswaps_' + swapId]);
        swapInfo = swapData.swapInfo;
        swapResponse = swapData.swapResponse;
        console.log('swap.105 swapfromlocal ', swapInfo, swapResponse);
        // swapStatus.message = swapData.status;
        continueSwap(swapData.swapResponse);
      } catch (error) {
        console.log('swap.109 error getting swapId: ', error.message);
      }
    }

    return (
      <BackGround>
        <Prompt />
        <View className={classes.wrapper}>
          <StepsWizard
            range={4}
            stage={1}
            id={swapResponse ? swapResponse.id : null}
            onExit={this.onExit}
          >
            <StepsWizard.Steps>
              <StepsWizard.Step
                num={1}
                render={() => (
                  <InputInvoice
                    swapInfo={swapInfo}
                    webln={webln}
                    onChange={setSwapInvoice}
                  />
                )}
              />
              <StepsWizard.Step
                num={2}
                render={() => (
                  <DownloadRefund
                    address={swapResponse.address}
                    currency={swapInfo.base}
                    redeemScript={swapResponse.redeemScript}
                    privateKey={swapInfo.keys.privateKey}
                    timeoutBlockHeight={swapResponse.timeoutBlockHeight}
                    swapInfo={swapInfo}
                    swapResponse={swapResponse}
                  />
                )}
              />
              <StepsWizard.Step
                num={3}
                render={() => (
                  <SendTransaction
                    swapInfo={swapInfo}
                    swapResponse={swapResponse}
                    swapStatus={swapStatus}
                    claimSwap={claimSwap}
                  />
                )}
              />
              <StepsWizard.Step
                num={4}
                render={() => (
                  <Confetti
                    notifie={() => (
                      <Paper
                        variant="outlined"
                        sx={{
                          m: 1,
                          py: 1,
                          mb: 2,
                          display: 'flex',
                          width: '100%',
                        }}
                        fullWidth
                      >
                        <CheckCircle
                          color="success"
                          fontSize="large"
                          sx={{ m: 1, fontSize: 36 }}
                        />
                        <Typography
                          variant="body1"
                          gutterBottom
                          component="div"
                          sx={{
                            mx: 'auto',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: 0,
                          }}
                          // color={this.state.statusColor}
                        >
                          {/* Swap successful 🎉 <br /> */}
                          You sent{' '}
                          {swapInfo.baseAmount || swapResponse.baseAmount}{' '}
                          {swapInfo.base} and received {swapInfo.quoteAmount}{' '}
                          {swapInfo.quote}
                        </Typography>
                      </Paper>

                      // <span className={style}>
                      //   You sent{' '}
                      //   {swapInfo.baseAmount || swapResponse.baseAmount}{' '}
                      //   {swapInfo.base} and received {swapInfo.quoteAmount}{' '}
                      //   {swapInfo.quote}
                      // </span>
                    )}
                  />
                )}
              />
            </StepsWizard.Steps>
            <StepsWizard.Controls>
              <StepsWizard.Control
                num={1}
                render={props => (
                  <Controls
                    loading={swapStatus.error || !this.props.retrySwap}
                    text={`Next`}
                    className={classes.stackscolor}
                    loadingText={
                      !this.props.retrySwap
                        ? 'Executing swap...'
                        : 'Invalid invoice'
                    }
                    onPress={() => this.startSwap(props.nextStage)}
                  />
                )}
              />
              <StepsWizard.Control
                num={2}
                render={props => (
                  <Controls
                    mobile
                    className={classes.stackscolor}
                    text={'I have downloaded the refund file'}
                    onPress={props.nextStage}
                  />
                )}
              />
              <StepsWizard.Control
                num={3}
                render={props => (
                  <Controls
                    mobile
                    text={swapStatus.message}
                    loading={swapStatus.pending}
                    error={swapStatus.error}
                    errorText={swapStatus.message}
                    errorRender={() => {}}
                    loadingRender={() => <Loading />}
                    onPress={props.nextStage}
                    swapStatus={swapStatus}
                    claimSwap={claimSwap}
                    swapResponse={swapResponse}
                  />
                )}
              />
              <StepsWizard.Control
                num={4}
                render={() => (
                  <Controls
                    text={'Swap Again!'}
                    className={classes.stackscolor}
                    onPress={this.completeSwap}
                  />
                )}
              />
            </StepsWizard.Controls>
          </StepsWizard>
        </View>
      </BackGround>
    );
  }
}

Swap.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  webln: PropTypes.object,
  swapInfo: PropTypes.object,
  swapResponse: PropTypes.object,
  completeSwap: PropTypes.func,
  setSwapInvoice: PropTypes.func,
  onExit: PropTypes.func,
  retrySwap: PropTypes.bool,
  nextStage: PropTypes.func,
  startSwap: PropTypes.func.isRequired,
  swapStatus: PropTypes.object.isRequired,
  inSwapMode: PropTypes.bool,
  claimSwap: PropTypes.func,
  continueSwap: PropTypes.func,
};

export default injectSheet(styles)(Swap);
