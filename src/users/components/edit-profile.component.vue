<script>
import { UsersApiService } from "../service/users-api.service.js";

export default {
  data() {
    return {
      dataLoaded: false,
      newName: '',
      boolName: true,
      newEmail: '',
      boolEmail: true,
      newCountry: null,
      boolCountry: true,
      newCity:null,
      boolCity: true,
      newPassword: '',
      boolPassword: true,
      countries: [],
      cities: []
    };
  },
  mounted() {
    const usersService = new UsersApiService();
    usersService.getUserById(1).then(response => {
      const user = response.data;
      this.newName = user.first_name;
      this.newEmail = user.email;
      usersService.getAllCountries().then(response => {
        this.countries = response.data;
        const userCountry = this.countries.find(country => country.id === user.country_id);
        if (userCountry) {
          this.newCountry = userCountry.id; // Asigna el id del país a newCountry
          this.cities = userCountry.cities; // Asigna las ciudades del país a cities
        }
        this.dataLoaded = true;
      });
    }).catch(error => {
      console.error('Error getting user:', error);
    });
  },
  watch: {
    newCountry(newCountryId) {
      const selectedCountry = this.countries.find(country => country.id === newCountryId);
      if (selectedCountry) {
        this.cities = selectedCountry.cities;
      } else {
        this.cities = [];
      }
    }
  },
  methods: {
    saveNameChange(newName) {
      this.boolName = true;
    },
    changeName() {
      this.boolName = false;
    },
    saveEmailChange(newEmail) {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (emailRegex.test(newEmail)) {
        this.boolEmail = true;
      } else {
        alert('Please enter a valid email address');
      }
    },
    changeEmail() {
      this.boolEmail = false;
    },
    saveCountryChange(newCountry) {
      this.boolCountry = true;
    },
    changeCountry() {
      this.boolCountry = false;
    },
    saveCityChange(newCity) {
      this.boolCity = true;
    },
    changeCity() {
      this.boolCity = false;
    },
    savePasswordChange(newPassword) {
      this.boolPassword = true;
    },
    changePassword() {
      this.boolPassword = false;
    },
    confirmApply() {
      this.$router.push('/control-panel');
    },
    signOut() {
      this.$router.push('/authentication');
    },

    updateCities(event) {
      const selectedCountry = this.countries.find(country => country.name === event.value);
      this.cities = selectedCountry.cities;
    },
  },
};
</script>

<template>
  <div class="smaller-div" v-if="dataLoaded">
    <pv-card class="highlighted-border">
      <template #title>
        <div class="profile-header">
          <h2 class="black">My Profile</h2>
        </div>
      </template>
      <template #content>
        <div class="profile-content">
          <div class="profile-image">
            <img class="rounded-full large-image" alt="avatar" src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg">
          </div>
          <div class="profile-details">
            <h3>Name:</h3>
            <pv-input-text v-model="newName" :disabled="boolName" />
            <pv-button class="green-button" v-if="!boolName" @click="saveNameChange(newName)">Check</pv-button>
            <a @click="changeName()">Change Name</a>
            <pv-divider/>
            <h3>Email:</h3>
            <pv-input-text v-model="newEmail" :disabled="boolEmail" />
            <pv-button class="green-button" v-if="!boolEmail" @click="saveEmailChange(newEmail)">Check</pv-button>
            <a @click="changeEmail()">Change Email</a>
            <pv-divider/>
            <h3>Country:</h3>
            <pv-dropdown v-model="newCountry" :options="countries" optionLabel="name" optionValue="id" :disabled="boolCountry" />
            <pv-button class="green-button" v-if="!boolCountry" @click="saveCountryChange(newCountry)">Check</pv-button>
            <a @click="changeCountry()">Change Country</a>
            <pv-divider/>
            <h3>City:</h3>
            <pv-dropdown v-model="newCity" :options="cities" optionLabel="name" :disabled="boolCity" />
            <pv-button class="green-button" v-if="!boolCity" @click="saveCityChange(newCity)">Check</pv-button>
            <a @click="changeCity()">Change City</a>
            <pv-divider/>
            <h3>Password:</h3>
            <pv-password v-model="newPassword" :disabled="boolPassword" />
            <pv-button class="green-button" v-if="!boolPassword" @click="savePasswordChange(newPassword)">Check</pv-button>
            <a @click="changePassword()">Change Password</a>
            <pv-divider/>
            <h3>Account</h3>
            <pv-button class="green-button" @click="confirmApply">Apply</pv-button>
            <pv-button class="red-button" @click="signOut()">Sign Out</pv-button>
          </div>
        </div>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.highlighted-border {
  border: 2px solid #000;
}
.red-button {
  background-color: #FF3439;
}
.green-button {
  background-color: #005f40;
}
.smaller-div {
  width: 55rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  display: block;
}

.large-image {
  height: 250px;
  width: 250px;
  border-radius: 50%;
}

.black{
  color: black;
}

.profile-content {
  display: flex;
  justify-content: space-between;
}

.profile-image {
  flex: 1;
}

.profile-details {
  flex: 2;
}
</style>