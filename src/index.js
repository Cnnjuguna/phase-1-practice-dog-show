document.addEventListener('DOMContentLoaded', () => {

const BASE_URL = 'http://localhost:3000';
let Endpoint = `${BASE_URL}/dogs`

// const dogTableCotent = document.querySelector('table-body');
// const dogTable = dogTableCotent.querySelector('.margin');

async function getDogData () {
    
    // const dogTableCotent = document.querySelector('table-body');
    // const dogTable = dogTableCotent.querySelector('.margin');

    try { 
        
        const response = await fetch(Endpoint,{
        method: 'GET',
        headers: {
            "Content-Type" : "application/json",
            Accept : "application/json"
            
            }
    
        });

        if (response.ok) {
            const dogData  = await response.json();
            return dogData;
        } 

    } catch (error) {
        console.error(error);
    }
}
   

    

async function renderDogsTable() {
    try {
      const dogs = await getDogData();
      console.log(dogs);
  
      const dogTableContent = document.querySelector('#table-body');
      if (!dogTableContent) {
        console.error("Element with ID 'table-body' not found.");
        return;
      }
  
      for (let dog of dogs) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const breedCell = document.createElement('td');
        const dogGender = document.createElement('td');
        const editButton = document.createElement('button');
        nameCell.textContent = dog.name;
        breedCell.textContent = dog.breed;
        dogGender.textContent = dog.sex;
        editButton.textContent = 'Edit Dog';
  
        row.appendChild(nameCell);
        row.appendChild(breedCell);
        row.appendChild(dogGender);
        row.appendChild(editButton);
        dogTableContent.appendChild(row);
  
        // Clicking on the edit button next to a dog should populate
        // the top form with that dog's current information.
        editButton.addEventListener('click', async () => {
          const updateDog = await updateTheDogForm(dog);
          if(updateDog) {
            row.querySelector(`td:nth-child(1)`).textContent = updateDog.name;
            row.querySelector(`td:nth-child(2)`).textContent = updateDog.breed;
            row.querySelector(`td:nth-child(3)`).textContent = updateDog.sex;
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  
    
    
    renderDogsTable();





// --------------Updating the details on the server------------//

async function updateDogServer(dogSelected) {
    const dogId = dogSelected.id;
    const updateEndpoint = `${BASE_URL}/dogs/${dogId}`;
  
    try {
      const response = await fetch(updateEndpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(dogSelected),
      });
  
      if (response.ok) {
        const dogData = await response.json();
        return dogData;
  
        // Update the selected dog details in the table

      }
    } catch (error) {
      console.log(error);
    }
  }
  
//   Make sure to replace the updateDogServer function in your code with the updated version provided above.
//  This should properly send the PATCH request with the dog information to update it on the server.
  




//---------------------------Updatiing the dog form details---------------------------//

async function updateTheDogForm(dogSelected) {
    const dogId = dogSelected.id;
    Endpoint = `${BASE_URL}/dogs/${dogId}`;
  
    const nameInput = document.querySelector('input[name="name"]');
    const breedInput = document.querySelector('input[name="breed"]');
    const sexInput = document.querySelector('input[name="sex"]');
  
    try {
      const response = await fetch(Endpoint, {
        method: 'PATCH', // Updated from GET to PATCH
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(dogSelected),
      });
  
      if (response.ok) {
        const updatedDog = await response.json();
        nameInput.value = updatedDog.name;
        breedInput.value = updatedDog.breed;
        sexInput.value = updatedDog.sex;
  
        const dogForm = document.querySelector('#dog-form');
        dogForm.dataset.dogId = dogId;
        return updatedDog;
      }
    } catch (error) {
      console.error(error);
    }
  }



    // On submit of the form, a PATCH request should
//  be made to http://localhost:3000/dogs/:id to
//  update the dog information
const submitButton = document.querySelector('input[name="submit"]');
submitButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const dogForm = document.querySelector('#dog-form');
    const nameInput = document.querySelector('input[name="name"]');
    const breedInput = document.querySelector('input[name="breed"]');
    const sexInput = document.querySelector('input[name="sex"]');


    const dogSelected = {
        id: parseInt(dogForm.dataset.dogId),
        name: nameInput.value,
        breed: breedInput.value,
        sex: sexInput.value
    };

    await updateDogServer(dogSelected);
    nameInput.value = '';
    breedInput.value = '';
    sexInput.value = '';

});




});