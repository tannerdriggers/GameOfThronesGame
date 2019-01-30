import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "gameofthrones-game",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCiK2Kj63jfLSqg\nOVzlbAjz0/g9H2f44o1H0B4/3QW45IzJQVxrjrbF5U8ShwEJE5sHNkdimeub0QTR\nN/D1V0sGCAfcOwd5HdgCtfzBOtu9zCsIEzZZEyi4SXJlUmyiO3+N3BaR+Dcch7WR\nZAd0cXkXw91WOhXtWtsNx4dMNUNqf/jjPo7dJmTTfDE30sIBgYKMBhh+PqDCTa7Z\nk4GgGPKY+OGtatuAOfEJlJn9FYKM83UEvfXpuHHwWjhbxduAXz5yT6/4gfQggxTQ\n5JrFYX0WqJZNfOTrpDUUK/jkFLesVnTwQRyQbyk6m3HcFHEd1he5yPxLBl2im9uD\nF+llvpbfAgMBAAECggEAE3mvXm00dmTnthc9e0Xmq1Wc/cYsR9z5R5MMVvIVslcs\nOy0wyq/4bjq0LM7uxmbG2u5fU02V2IAZGoEj3Grv1RkYzI+APcDiRK0TXidR5XDE\nCDO6dqcQ4FTduqJT7oXDs0cnpL8Q60m2+e9v38GS39JDXgwavwcGwJhiPLo2zu6/\ne15weyLhzqginAZXrPlG3I+aEX6rgU//GlclykOvgcthIaVs/nG65mLL5DRMtRnm\nE2hBs8z+CMK+2CrPkC7enIXXJvMUOjDRxzrX32F5XwLSB0h9ss3t1UFdYp8BO+Ge\n+70YsSh5jsDd3/S1AF/PG6N3ID15gOb94/+304Ds7QKBgQDUYmV1rCWZeaKfAuwD\nAzGAIzOVqxLMHgYStJ4Wty4pC/MloC7A7VxFFgW+T3Je4MUJZA8Wu5wq/CpdDTsq\nlQJf7jk9oX3BuDRSoLqUieFjvG5eOdOZ0OMefVl6PDV0skBfloUjtw/NotJcPYcj\ne/62hJu7n7eVnT3nnCX6AH1T2wKBgQDDeQ981X6C3UZx6zr3i/eTPTSXLu/iXlTV\nsGhxg/z192ucLMRzT25e+T5pN6hIClvBsvwWERco28yZO2UVOzvciQyu2Jgz/hMS\nyYn9krV/2BD5YOlB49AUGEmihEaBak63ayIj35iMdOMRqCkwIMQXkcLZiYJoxWMy\nPVDSGSJ6TQKBgQC3vxmAoRs2mSG06NZAFPcyoUHz7zooFqGydUmA5aKuKISIvPk2\nOSVnMBJwAFQ2+cf+w+66AD6wgdI1B0l1Ic4YKQak557hhvjds+k4scGqhFAIfYcw\nwKR+sHxFYOnuuHkxOgyeRbcKdiABZcoRTSmlxzzlKt2uN4hjZZkFnn7PmQKBgGR7\nYcvBD5SD3MeIrTo9WBn3N4aT2TpbVW63jSj1OV7TPhz9IktIRKtLopqBwt6tfHd4\n438QcABP5L/MOW0NkvsN9FgY/TyU2gcpVObluKksT6Vx/NYjHn6F8aw6JOg31pkQ\n2G7qbMee+m7EK9ASt9qJ0kjzF/d1qEVWIaquwvttAoGAT82oNmSHE9gfB1QkGZa8\n1KMofj6Hzq65tKlN+VQx+6W5dntIok0Ufh/pfjikInVH2JYDGFHUgKdvhZ7Bh+/8\nPV5/xsDxgzAppw2u8MsM+Sd9TRmiSBC8Kr/6BlxUHoia2FzIzucBJBbppPdSzFyS\nsGEZw6I26Wfm3+9X+m/z2dA=\n-----END PRIVATE KEY-----\n",
        clientEmail: "firebase-adminsdk-e30hb@gameofthrones-game.iam.gserviceaccount.com",
    }),
    databaseURL: 'https://gameofthrones-game.firebaseio.com'
});

// const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const stripe = require('stripe')(functions.config().stripe.testkey);

var db = admin.firestore();

exports.stripeCharge = functions.firestore.document('/payments/{paymentId}').onWrite((change, context) => {
    const payment = change.after.data();
    const paymentId: string = context.params.paymentId;
    if (payment) {
        // const paymentId = userId;
    
        if (!payment || payment.charge) {
            console.log('Payment already taken or is null');
            console.log('Payment: ' + !payment);
            console.log('Payment Charge(t or f): ' + !!payment.charge);
            return false;
        }
    
        let userID: string = paymentId.split('_')[0];
        
        const amount = payment.amount;
        // const idempotency_key = paymentId; // prevent duplicate charges
        const source = payment.token.id;
        const currency = 'usd';
        const charge = { amount, currency, source };
        stripe.charges.create(charge);
        db.doc(`/payments/${paymentId}`).update({
            charge: charge
        });

        let poolId = payment.poolId;
        let pool = db.doc(`/pool/${poolId}`);
        pool.get().then(snapshot => {
            const largerArray = snapshot.get('users');
            largerArray.push(db.doc(`/users/${userID}`));
            pool.update(pool.update('users', largerArray));
        })

        return true;
    }
    return false;
});


