import React, { useEffect} from 'react';
import Box from '@mui/material/Box';

// import Homecard component
import HomeCard from "../homeCard/HomeCard.jsx"
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
    searchResults: state.display.searchResults
})

function ResultDisplay( props) {

    // console.log(resultsArr)
    // set up onclick to route to the respective landlord id
    // render our cards out

    if (!resultsArr){
    return(
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                p: 1,
                m: 1,
                bgcolor: 'background.paper',
                maxWidth: 1000,
                borderRadius: 1
            }}
        >
        </Box>
    )}
    else {
        return(
            <div className="homeCards" data-aos="fade-up" data-aos-duration="1000" id="homeCards">
              {props.searchResults.map((landlordObj, index) => <HomeCard landlord={landlordObj} key={index}/>)}
            </div>
        )
    }

}

export default connect(mapStateToProps, null)(ResultDisplay)