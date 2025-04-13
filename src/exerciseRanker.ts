import discord from "./clients/discord";
import spreadsheets from "./clients/spreadsheets";

type difficulty = "EASY" | "MEDIUM" | "HARD";
type status = "COMPLETED" | "FAILED";
type nickname = string;

interface Exercise {
	id: number;
	title: string;
	url: string;
	acceptancePercentage: number;
	difficulty: difficulty;
	frequencyPercentage: number;
	status?: status;
	conductor?: nickname;
	contributors: nickname[];
}

const RANKING_POINTS = {
	CONTRIBUTION: 1,
	FAILED: 2,
	COMPLETED: {
		EASY: 3,
		MEDIUM: 4,
		HARD: 5,
	},
};

const main = async (env: Env) => {
	console.log("Fetching exercises from Google Sheets...");
	const rows = await spreadsheets.getRows(env.GOOGLE_SPREADSHEETS_ID, env.GOOGLE_SPREADSHEETS_GID);
	const exercises = rows.slice(1).map((row) => buildExercise(row)); // Skip header row

	const ranking = calculateRanking(exercises);
	const content = formatRanking(ranking, env.DISCORD_EXERCISE_EVENT_URL);

	console.log("Sending ranking to Discord...");
	await discord.sendMessage(
		env.DISCORD_EXERCISE_RANKER_WEBHOOK_ID,
		env.DISCORD_EXERCISE_RANKER_WEBHOOK_TOKEN,
		content,
	);
};

const buildExercise = (row: string[]): Exercise => ({
	id: parseInt(row[0]),
	title: row[1],
	url: row[2],
	// Remove the percentage char and parse it as float
	acceptancePercentage: parseFloat(row[3].slice(0, -1)),
	difficulty: row[4] as difficulty,
	// Remove the percentage char and parse it as float
	frequencyPercentage: parseFloat(row[5].slice(0, -1)),
	status: row[6] !== "" ? (row[6] as status) : undefined,
	conductor: row[7] !== "" ? row[7] : undefined,
	// Filter out empty strings
	contributors: row[8].split(";").filter((contributor) => contributor !== ""),
});

const calculateRanking = (exercises: Exercise[]) => {
	const workedExercises = exercises.filter((ex) => ex.status !== undefined);
	const ranking = new Map<string, number>();

	for (const exercise of workedExercises) {
		const { status, difficulty, conductor, contributors } = exercise;

		if (conductor === undefined) continue;

		const conductorPoints =
			status === "COMPLETED" ? RANKING_POINTS.COMPLETED[difficulty] : RANKING_POINTS.FAILED;

		ranking.set(conductor, (ranking.get(conductor) ?? 0) + conductorPoints);
		for (const contributor of contributors) {
			ranking.set(contributor, (ranking.get(contributor) ?? 0) + RANKING_POINTS.CONTRIBUTION);
		}
	}
	return ranking;
};

const formatRanking = (ranking: Map<string, number>, eventUrl: string) => {
	const sortedRanking = [...ranking.entries()].sort((a, b) => {
		if (b[1] === a[1]) {
			return a[0].localeCompare(b[0]);
		}
		return b[1] - a[1];
	});
	const medals = ["🥇", "🥈", "🥉"];
	const participantLines = sortedRanking.map(([nickname, points], index) => {
		const position = index < medals.length ? medals[index] : `${index + 1}º`;
		return `${position}  @${nickname}: ${points} pts`;
	});

	return (
		`🏆 **Ranking do Desafio Semanal de Algoritmos**\n\n` +
		participantLines.join("\n") +
		`\n\nParticipe do [próximo evento](${eventUrl}) e pontue também!`
	);
};

export default { main };
