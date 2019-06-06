import Mailgen from 'mailgen'

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    // Appears in header & footer of e-mails
    name: 'Turing Eccomerce',
    link: 'https://mailgen.js/'
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  }
})
/**
* @description This generates emailTemplate
* to be sent to the customer
* @param  {Array} data
* @returns {HTMLElement}e mailGenEmailTemplate
*/
const emailTemplate = (data) => {
  console.log(data)
  const emailBody = {
    body: {
      name: data.name,
      intro: ['Find your order details below:'],
      table: {
        data: data.order,
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            itemId: '10%',
            name: '25%',
            attributes: '10%',
            quantity: '15%',
            price: '10%',
            subtotal: '30%'

          }
        }
      }
    }
  }
  return mailGenerator.generate(emailBody)
}

export default emailTemplate
