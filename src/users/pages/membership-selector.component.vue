<script>
import {UsersApiService} from "../service/users-api.service.js";

export default {
  data() {
    return {
      memberships: [],
      selectedMembership: null,
      colors: ["#005F40", "#9D7C58", "#9A5D4E"]
    };
  },
  created() {
    const usersService = new UsersApiService();

    usersService.getAllSubscriptions()
        .then(response => {
          console.log('Data received from server:', response.data);
          this.memberships = response.data;
        })
        .catch(error => {
          console.error(error);
        });
  },
  computed: {
    selectedMembershipDetails() {
      return this.memberships.find(membership => membership.id === this.selectedMembership);
    }
  },
  methods: {
    selectMembership(id) {
      this.selectedMembership = id;
    },
    confirmSelection() {
      this.$router.push('/user-profile-edit');
    }
  }
};
</script>

<template>
  <div class="membership-selector">
    <h1>Select your subscription</h1>
    <div class="memberships">
      <pv-card
          v-for="(membership, index) in memberships"
          :key="membership.id"
          class="membership-option"
          :class="{ selected: selectedMembership === membership.id }"
          @click.native="selectMembership(membership.id)"
          :style="{ backgroundColor: colors[index % colors.length], color: '#fff' }"
      >
        <template #title>
          <h2>{{ membership.name }}</h2>
        </template>
        <template #content>
          <p>{{ membership.description }}</p>
          <p><strong>$ {{ membership.price }} /month</strong></p>
        </template>
      </pv-card>
    </div>
    <div v-if="selectedMembership" class="selected-details">
      <h2>Subscription selected</h2>
      <p><strong>{{ selectedMembershipDetails.name }}</strong></p>
      <p>{{ selectedMembershipDetails.description }}</p>
      <p><strong>${{ selectedMembershipDetails.price }}</strong></p>
      <button class="confirm-button" @click="confirmSelection">Confirm</button>
    </div>
  </div>
</template>

<style scoped>
.membership-selector {
  text-align: center;
}
.memberships {
  display: flex;
  justify-content: center;
  gap: 20px;
}
.membership-option {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 20px;
  width: 200px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.membership-option.selected {
  background-color: #f0f0f0;
  border-color: #000;
}
.membership-option:hover {
  background-color: #f9f9f9;
}
.membership-selector {
  text-align: center;
  color: #000;
}
.confirm-button {
   background-color: #005F40;
   color: #fff;
   border: none;
   padding: 10px 20px;
   cursor: pointer;
 }
.confirm-button:hover {
  background-color: #004D33;
}
</style>