<template>
  <div class="membership-selector">
    <h1>Select your subscription</h1>
    <div class="memberships">
      <pv-card
          v-for="(membership, index) in memberships"
          :key="membership.id"
          class="membership-option"
          @click="selectMembership(membership)"
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

    <div class="selected-details" v-if="selectedMembership.id !== 0">
      <h2>Subscription selected</h2>
      <p><strong>{{ selectedMembership.name }}</strong></p>
      <p>{{ selectedMembership.description }}</p>
      <p><strong>${{ selectedMembership.price }}</strong></p>
      <button class="confirm-button" @click="confirmSelection">Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      memberships: [
        {id: 1, name: 'Basic', description: 'Registration of 5 crops. Process monitoring', price: '2.99'},
        {
          id: 2,
          name: 'Regular',
          description: 'Basic plan benefits but with 15 crops. Statistical graphs on agricultural production',
          price: '7.99'
        },
        {
          id: 3,
          name: 'Premium',
          description: 'Regular benefits but with unlimited crops. Customization of alerts according to user needs',
          price: '14.99'
        }
      ],
      selectedMembership: {id: 0, name: '', description: '', price: ''},
      colors: ["#005F40", "#9D7C58", "#9A5D4E"]
    };
  },

  methods: {
    selectMembership(membership) {
      this.selectedMembership = Object.assign({}, membership); // Make a copy of membership object
    },
    confirmSelection() {
      alert('Creacion exitosa!');
      this.$router.push('/control-panel');
    }
  }
};
</script>

<style scoped>
.membership-selector {
  text-align: center;
}

.memberships {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.membership-option {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 20px;
  width: 250px;
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

.selected-details {
  color: black;
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
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