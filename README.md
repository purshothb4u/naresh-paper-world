# Naresh & the Paper World

A playable, hand-drawn browser platformer inspired by the supplied character screenshot. Naresh is the playable hero, drawn from his adult and childhood photos in a transparent cartoon sprite. Mani, Aravind, and Vimal are roaming characters based on their supplied photos. Mani carries a stylized gun, Aravind holds an axe, and Vimal appears as a gym trainer with dumbbells. No build dependencies.

## Play locally

Run `npm start` and open http://localhost:4173. Run `npm test` for the gameplay checks. The server binds only to your computer. An optional Google Fonts stylesheet improves typography; local font fallbacks work offline.

To share the game online, run `npm run build:share`, then upload the `publish` folder to a static website host. The `publish` folder contains the game files and the cartoon character assets under `assets/`. After upload, send the public link to anyone you want to play.

For automatic AWS Amplify Hosting deployments, connect the GitHub repository and its `main` branch in the Amplify console. The checked-in `amplify.yml` runs gameplay tests, builds `publish`, and serves it as the site root. Each push to `main` triggers a new deployment. Keep the GitHub repository private because the character artwork is based on personal photos. Amplify's public game URL is still accessible to anyone with the link.

Move with arrows or A/D, jump with Space/W/up, shoot with X/J, pause with P/Escape, restart with R. Hold jump for more height. Labeled touch controls are available on phones and touch devices. Sound is on by default and starts after the first tap or key press, as required by mobile browser audio policies. The sound button can still mute the current session.

Explore Chennai (2024), Thanjavur (2025), and Bangalore (2026), collect 36 stars per city, shoot or stomp enemies, and reach the year flag. City backdrops use sketchbook interpretations of Chennai Central station, the Big Temple, and Vidhana Soudha. The generated cartoon characters are saved as `assets/naresh-cartoon.png`, `assets/mani-cartoon.png`, `assets/aravind-cartoon.png`, and `assets/vimal-cartoon.png`. Falling or touching enemies costs one of three hearts. A midway flag saves your respawn point for the current attempt; a pink heart restores health. Later worlds include enemy projectiles. Progress stays in the current game session.

`engine.js` contains the simulation, `app.js` handles rendering and interaction, and `style.css` defines the responsive page. All character and environment artwork is drawn with canvas paths.
