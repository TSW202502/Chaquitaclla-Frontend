export class Profile {
    constructor(id, fullName, emailAddress, countryId,subscriptionId,cityId, firstName = null, lastName= null) {
        this.id = id;
        this.fullName = fullName;
        this.emailAddress = emailAddress;
        this.countryId= countryId;
        this.cityId = cityId;
        this.subscriptionId = subscriptionId;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
export class Profile2 {
    constructor(firstName, lastName, email, cityId, subscriptionId, countryId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.cityId = cityId;
        this.subscriptionId = subscriptionId;
        this.countryId= countryId;
    }
}