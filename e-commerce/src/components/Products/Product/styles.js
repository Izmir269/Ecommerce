import {makeStyles} from '@material-ui/core/styles';


//instant return ({})
export default makeStyles(() => ({
    root: {
        maxWidth: '100%'
    },
    media: {
        height: 0,
        padding: '56.25%' ,
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end' ,
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between' ,
    }
}));

