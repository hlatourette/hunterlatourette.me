async function getWeather(latitude, longitude) {
    let weather = {
        temperature: 0.0,
        temperatureAparent: 0.0,
        relativeHumidity: 0,
        precipitation: 0,
        cloudCover: 0,
        isDay: 0
    };
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,cloud_cover`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    return weather;
}

export { getWeather };

