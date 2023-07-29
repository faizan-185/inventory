function generateRandomNumber() {
    const min = 100000; // Minimum 9-digit number
    const max = 999999; // Maximum 9-digit number

    return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export default generateRandomNumber