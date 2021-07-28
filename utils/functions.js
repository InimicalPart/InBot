const mongoose = require('mongoose');
const { Profile } = require('../models/');

module.exports = client => {

    client.createProfile = async profile => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, profile);

        const newProfile = await new Profile(merged);
        return newProfile.save()
            .then(console.log(`New profile created for user "${merged.username}" (${merged.userID})`));
    };

    client.getProfile = async user => {
        const data = await Profile.findOne({ userID: user.id });
        if (data) return data;
        else return;
    };

    

    client.updateProfile = async (user, data) => {
        let profile = await client.getProfile(user);

        if (typeof profile !== 'object') profile = {};
        for (const key in data) {
            if (profile[key] !== data[key]) profile[key] = data[key];
            else return;
        }

        console.log(
            `Profile for "${user.username}" (${user.id}) updated. | ${Object.keys(data)}`);
        return await profile.updateOne(profile); 
    };

};