export const getFormattedDate = () => {
     const date = new Date()
     const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN","JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
     const month = months[date.getMonth()]
     const year = date.getFullYear()
     return `${month}-${year}`
};