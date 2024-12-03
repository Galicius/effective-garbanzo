import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";

const EditEntryForm = ({ entryId }) => {
    const [formData, setFormData] = useState({
        hoursWorked: "",
        date: "",
        description: "",
    });

    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/entries/${entryId}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching entry:", error);
            }
        };
        fetchEntry();
    }, [entryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            console.log("Updating entry with ID:", entryId); // Debugging log
            console.log("Form data:", formData); // Log form data for debugging
            await axios.put(`http://localhost:5000/api/entries/${entryId}`, formData);
            alert("Entry updated successfully");
        } catch (error) {
            console.error("Error updating entry:", error); // Log error if update fails
            alert("Error updating entry");
        }
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Uredi vnos
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Oddelane ure"
                        name="hoursWorked"
                        value={formData.hoursWorked}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="number"
                    />
                    <TextField
                        label="Datum"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Opombe"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2}}
                    >
                        Shrani
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

EditEntryForm.propTypes = {
    entryId: PropTypes.string.isRequired,
};

export default EditEntryForm;
