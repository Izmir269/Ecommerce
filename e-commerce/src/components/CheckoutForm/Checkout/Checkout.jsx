import React, {useState, useEffect} from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, cssBaseline} from '@material-ui/core';
import {Link, useHistory} from 'react-router-dom';
import {commerce} from '../../../lib/commerce';
import useStyle from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps=['Renseignez votre adresse', 'Détails de payement'];

const Checkout = ({cart, order, onCaptureCheckOut, error}) => {
    const classes = useStyle();
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setcheckoutToken] = useState(null);
    const [shippingData, setshippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });
                    setcheckoutToken(token);
            } catch (error) {
                //console.log(error);
                history.pushState('/'); //retour à la page d'accueil
            }
        }

        generateToken();
    },[cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


    //avoir les données des inputs dans la partie payement
    const next = (data) => {
        setshippingData(data);
        nextStep();
    }
    //timeout lors du payment. 
    const timeout=() => {
        setTimeout(() => {
            setIsFinished(true);
        }, 3000);
    }
    //confirmation après payement
    let Confirmation = () => order.customer ? (
        <>
          <div>
            <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}!</Typography>
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
          </div>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
      ) : isFinished ? (
        <>
          <div>
            <Typography variant="h5">Thank you for your purchase!</Typography>
            <Divider className={classes.divider} />
          </div>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
        </>
      ) : (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      );
      

      if (error) {
        Confirmation = () => (
          <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} variant="outlined" type="button" to="/">Back to home</Button>
          </>
        );
      }
        

    const Form = () => (
        activeStep === 0 ? <AddressForm checkoutToken= {checkoutToken} next={next}/> : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckOut={onCaptureCheckOut} timeout={timeout} />
    )
    

    return (
        <>
        <cssBaseline />
        <div className={classes.toolbar}/>
        <main className= {classes.layout}>
            <Paper className= {classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper activeStep={activeStep} className= {classes.stepper}>
                    {
                        steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))
                    }

                </Stepper>
                {
                    activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />
                }

            </Paper>

        </main>
            
        </>
    )
}

export default Checkout
