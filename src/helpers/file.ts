import { createWriteStream, unlink } from 'fs';
import { get } from 'https';

/**
 * Baixa um arquivo qualquer.
 * @param localPath Caminho local do arquivo.
 * @param remotePath Link do arquivo distante.
 * @since 0.2.2
 */
export async function download(
	localPath: string,
	remotePath: string
): Promise<void> {
	const file = createWriteStream(remotePath);

	get(localPath, (response) => {
		response.pipe(file);
		file.on('finish', () => {
			file.close();
		});
	}).on('error', (err) => {
		if (err) throw err;

		unlink(remotePath, (err) => {
			if (err) throw err;
		});
	});
}
