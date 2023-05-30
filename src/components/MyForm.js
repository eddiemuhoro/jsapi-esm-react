import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createUsers } from '../graphql/mutations';
const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    age: '',
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send the form data to AWS RDS database
    // You can implement this part using AWS SDK and API endpoints
    try{
        await API.graphql(graphqlOperation(createUsers, {input: formData}))

        alert('Successfully submitted!')
    

    // Example code to log the form data
    console.log(formData);

    // Reset the form after submission
    setFormData({
      name: '',
      location: '',
      age: '',
    });
    }catch(e){
        console.log(e)
        }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
