import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// import MUI components
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import { ThemeProvider } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";

// import theme
import tomatopalette from "../theme/tomatopalette.jsx";

export function ReviewPage({ userData }) {
  // get landlord id
  const landlordID = useParams();
  // console.log('landlordID:  ',landlordID)
  // console.log('userdata:  ',userData)
  //get landlordName
  const [landlordName, setlandlordName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [addresses, setAddresses] = React.useState([]);
  const [selected, setSelected] = React.useState("");

  useEffect(() => {
    fetch(`/landlords/getByID/${landlordID.landlord_id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((parsed) => {
        setlandlordName(parsed.first_name + " " + parsed.last_name);

        if (!parsed.first_name) {
          fetch(`/user/getUserById/${parsed.user_id}`)
            .then((res) => res.json())
            .then((user) => {
              setlandlordName(null);
              console.log(user.company);
              setCompanyName(user.company);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`/address/byLandlord/${landlordID.landlord_id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAddresses(
          data
            ? data.map(
                (address, i) =>
                  `${address._id} ${address.street_num} ${address.street}, ${address.state}`
              )
            : null
        );
      });
  }, []);

  // handle title input (limit 100)
  const [title, setTitle] = React.useState("");
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // calculate overall rating
  const overallCalc = (...values) => {
    const arr = [...values];
    const newArr = arr.filter((val) => val !== null);
    if (newArr.length === 0) return 0;
    return newArr.reduce((a, b) => a + b) / newArr.length;
  };
  // handle rating inputs
  const [respect, setRespect] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  const [tlc, setTlc] = React.useState(null);
  const [personalization, setPersonalization] = React.useState(null);

  // handle bike / pet friendly
  const [bike, setBike] = React.useState(false);
  const handleBikeChange = (e) => {
    setBike(!bike);
  };

  const [pet, setPet] = React.useState(false);
  const handlePetChange = (e) => {
    setPet(!pet);
  };

  //handle description input (limit 1000)
  const [description, setDescription] = React.useState("");
  const handleDescChange = (e) => {
    setDescription(e.target.value);
  };

  // method to handle form submission
  const sendReview = () => {
    // build req body
    const formBody = {
      title: title,
      username: userData.username,
      overall_rating: overallCalc(respect, response),
      respect_rating: respect,
      responsiveness_rating: response,
      tlc: tlc,
      personalization: personalization,
      bike_friendly: bike,
      pet_friendly: pet,
      description: description,
      user_id: userData._id,
      landlord_id: landlordID.landlord_id,
      address_id: selected,
    };

    fetch(`/reviews/${landlordID.landlord_id}`, {
      method: "POST",
      body: JSON.stringify(formBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        window.location = `/profile/${landlordID.landlord_id}`;
      })
      .catch((error) => console.log(error));
  };

  // will need the Landlord name from somewhere (props?)

  return (
    <ThemeProvider theme={tomatopalette}>
      <div className="reviewPageGlobalContainer">
        <Container className="reviewMainContainer" maxwidth="sm" sx={{ p: 2 }}>
          <Box className="reviewformContainer" sx={{ p: 2 }}>
            <h2>Review of {landlordName || companyName}</h2>
            <TextField
              fullWidth
              required
              label="Title"
              value={title}
              onChange={handleTitleChange}
              inputProps={{ maxLength: 100 }}
              helperText="Max 100 Characters"
              sx={{ mb: 2, mt: 2 }}
            />
            <Autocomplete
              disablePortal
              clearOnEscape
              options={addresses}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select an Address (optional)" />
              )}
              value={selected}
              onChange={(e, newVal) => {
                setSelected(newVal[0]);
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Overall Rating</h3>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  required
                  size="large"
                  style={{ color: "tomato" }}
                  precision={0.5}
                  value={overallCalc(respect, response)}
                  readOnly
                />
              </Grid>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Respectfulness</h3>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  required
                  size="large"
                  style={{ color: "tomato" }}
                  precision={0.5}
                  value={respect}
                  onChange={(e, val) => setRespect(val)}
                />
              </Grid>
              <Grid item xs={6}>
                <h3 className="reviewLabel">Responsiveness</h3>
              </Grid>
              <Grid item xs={6}>
                <Rating
                  required
                  size="large"
                  style={{ color: "tomato" }}
                  precision={0.5}
                  value={response}
                  onChange={(e, val) => setResponse(val)}
                />
              </Grid>
              {selected && (
                <>
                  <Grid item xs={6}>
                    <h3 className="reviewLabel">TLC</h3>
                  </Grid>
                  <Grid item xs={6}>
                    <Rating
                      required
                      size="large"
                      style={{ color: "tomato" }}
                      precision={0.5}
                      value={tlc}
                      onChange={(e, val) => setTlc(val)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <h3 className="reviewLabel">Personalization</h3>
                  </Grid>
                  <Grid item xs={6}>
                    <Rating
                      required
                      size="large"
                      style={{ color: "tomato" }}
                      precision={0.5}
                      value={personalization}
                      onChange={(e, val) => setPersonalization(val)}
                    />
                  </Grid>
                </>
              )}
              {/* <Grid item xs={6}>
                                    <h3 className="reviewLabel">Bike Friendly?</h3>
                                </Grid>
                                <Grid item xs={6}>
                                    <Checkbox checked={bike} onChange={handleBikeChange} size="medium" style={{paddingTop:4, paddingLeft:0}}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <h3 className="reviewLabel">Pet Friendly?</h3>
                                </Grid>
                                <Grid item xs={6}>
                                    <Checkbox checked={pet} onChange={handlePetChange} size="medium" style={{paddingTop:4, paddingLeft:0}}/>
                                </Grid> */}
            </Grid>
            <TextField
              fullWidth
              required
              label="Additional Comments"
              multiline
              rows={4}
              inputProps={{ maxLength: 1000 }}
              helperText="Max 1000 Characters"
              value={description}
              onChange={handleDescChange}
              sx={{ mb: 2, mt: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() =>
                  window.location.replace(`/landlord/${landlordID.landlord_id}`)
                }
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={sendReview}>
                Submit
              </Button>
            </Stack>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
