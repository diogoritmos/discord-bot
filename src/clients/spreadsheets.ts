const getRows = async (spreadsheetId: string, gid: string) => {
	const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?gid=${gid}&single=true&output=csv`;
	const res = await fetch(url);

	console.log(`Google Sheets response: ${res.status} ${res.statusText}`);
	if (!res.ok) {
		throw new Error(`Failed to fetch Google Spreadsheets: ${res.statusText}`);
	}

	const csv = await res.text();
	return csv
		.trim()
		.split("\n")
		.map((line) => line.trim().split(","));
};

export default { getRows };
