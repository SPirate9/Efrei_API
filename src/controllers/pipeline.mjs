import axios from 'axios';

class Pipeline {
  constructor(app, AuthToken) {
    this.app = app;
    this.AuthToken = AuthToken;
    this.getData();
  }

  getData() {
    this.app.get('/pipeline', this.AuthToken, async (req, res) => {
      try {
        const headers = {
          headers: {
            'X-Api-Key': 'f994c83e6aae4fa3a79d7b4f4f121370'
          }
        };
        const userRandom = await axios.get('https://randomuser.me/api/');
        const phoneNumberRandom = await axios.get(
          'https://randommer.io/api/Phone/Generate?CountryCode=FR&Quantity=1',
          headers
        );
        const ibanRandom = await axios.get(
          'https://randommer.io/api/Finance/Iban/fr',
          headers
        );
        const creditCardRandom = await axios.get(
          'https://randommer.io/api/Card?type=AmericanExpress',
          headers
        );
        const nameRandom = await axios.get(
          'https://randommer.io/api/Name?nameType=firstname&quantity=1',
          headers
        );
        const socialNumberRandom = await axios.get(
          'https://randommer.io/api/SocialNumber',
          headers
        );
        const boredResponse = await axios.get('https://bored-api.appbrewery.com/random');
        const yesNoResponse = await axios.get('https://yesno.wtf/api');
        res.status(200).json({
          user: {
            name: `${userRandom.data.results[0].name.first} ${userRandom.data.results[0].name.last}`,
            email: userRandom.data.results[0].email,
            gender: userRandom.data.results[0].gender,
            location: `${userRandom.data.results[0].location.city}, ${userRandom.data.results[0].location.country}`,
            picture: userRandom.data.results[0].picture.large
          },
          phone_number: phoneNumberRandom.data[0],
          iban: ibanRandom.data,
          credit_card: {
            card_number: creditCardRandom.data.cardNumber,
            card_type: creditCardRandom.data.type,
            expiration_date: creditCardRandom.data.date,
            cvv: creditCardRandom.data.cvv
          },
          random_name: nameRandom.data[0],
          social_number: socialNumberRandom.data[0],
          activity: boredResponse.data.activity,
          yes_no: yesNoResponse.data.answer
        });
      } catch (err) {
        console.error(`ERROR Pipeline -> ${err}`);
        res.status(400).json({
          code: 400,
          message: 'Bad request'
        });
      }
    });
  }
}

export default Pipeline;
