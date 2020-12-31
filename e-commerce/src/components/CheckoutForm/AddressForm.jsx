import React, {useState, useEffect} from 'react';
import {InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import { useForm, FormProvider} from 'react-hook-form';
import {Link} from 'react-router-dom';

import {commerce} from '../../lib/commerce';

import FormInput from './CustomTextFied';

const Address = ({checkoutToken, next}) => {
    /*
    On va utiliser React hook form au lieu de Redux Form parcequ'il y'a beaucoup moins de renders
    dans les useSate on va gérer les select parce que le choix du pays entraine une liste différente
    de regions à afficher, puis le choix de la sous-zone entraine des options différents
    on va avoir en state à chaque fois la liste total puis dans un autre state le choix fait
    */
   const [shippingCountries, setshippingCountries] = useState([]);
   const [shippingCountry, setshippingCountry] = useState('');
   const [shippingSubdivisions, setshippingSubdivisions] = useState([]);
   const [shippingSubdivision, setshippingSubdivision] = useState('');
   const [shippingOptions, setshippingOptions] = useState([]);
   const [shippingOption, setshippingOption] = useState('');
   const methods = useForm();


    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
        setshippingCountries(countries);
        setshippingCountry(Object.keys(countries)[0]);
    }

    const fetchSubDivisions = async (countryCode) => {
        const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
        console.log(subdivisions);
        setshippingSubdivisions(subdivisions);
        setshippingSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
        setshippingOptions(options);
        setshippingOption(options[0].id);
    }

    
    useEffect(() => {
      fetchShippingCountries(checkoutToken.id);
    }, []);
    //Ce useEffet est dépendant du fait qu'il y'est un pays selectionné
    useEffect(() => {
       if(shippingCountry) fetchSubDivisions(shippingCountry);
    }, [shippingCountry]);

    useEffect(() => {
      if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision])

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping address</Typography>
            <FormProvider {...methods}> 
            {/* spread the method for a dynamic purpose. Appartient à react-hook-form. data va contenir les infos des différents input. Dans next on spred les data qui vient des inputs auxquels on rajoute les valeurs des différents select */}
                <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivision, shippingSubdivision}))}>
                    <Grid container spacing={3}>
                        <FormInput  name='firstName' label='FirstName'/>
                        <FormInput  name='lastName' label='lastName'/>
                        <FormInput  name='address1' label='Address'/>
                        <FormInput  name='email' label='Email'/>
                        <FormInput  name='city' label='City'/>
                        <FormInput  name='zip' label='ZIP/Code postal'/>



                 




                 <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setshippingCountry(e.target.value)}>
                {Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subdivision</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e) => setshippingSubdivision(e.target.value)}>
                {Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setshippingOption(e.target.value)}>
                {shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` })).map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

                    </Grid>
                    <br></br>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to="/cart" variant="outlined">Retour au panier</Button>
                        <Button type="submit" variant="contained" color="primary">Suivant</Button>
                    </div>

                </form>

            </FormProvider>
        </>
    )
}

export default Address
