import multer from 'multer';
import cloudinary from 'cloudinary';
import path from 'path';
import { unlink, mkdir, rename } from 'fs/promises';
import { existsSync } from 'fs';
import { v4 } from 'uuid';
import { spawn } from 'child_process';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});

const testFfmpegExecutable = () => {
	return new Promise<boolean>((resolve, reject) => {
		const subprocess = spawn('ffmpeg', ['-version']);

		subprocess.on('close', code => {
			if (code === 0) {
				resolve(true);
			}
			resolve(false);
		});

		subprocess.on('error', _ => {
			resolve(false);
		});
	});
};

const fileFilter =
	(allowedMimeTypes: string[]) =>
	(_: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
		if (allowedMimeTypes.includes(file.mimetype)) {
			return callback(null, true);
		}

		callback(null, false);
	};

const storage = (storagePath: string) =>
	multer.diskStorage({
		destination: async (_, __, callback) => {
			await mkdir(storagePath, { recursive: true });
			callback(null, storagePath);
		},
		filename: (_, file, callback) => {
			callback(null, `${v4()}${path.extname(file.originalname)}`);
		}
	});

export const coreUploadFile = (
	fileSizeLimit: number,
	filesNumberLimit: number,
	allowedMimeTypes: string[],
	storagePath: string,
	fieldName: string
) => {
	return multer({
		storage: storage(storagePath),
		limits: { fileSize: fileSizeLimit, files: filesNumberLimit },
		fileFilter: fileFilter(allowedMimeTypes)
	}).single(fieldName);
};

export const coreUploadToExternalStorage = async (
	destinationFolder: string,
	imagePath: string
) => {
	return await cloudinary.v2.uploader.upload(imagePath, {
		folder: destinationFolder,
		overwrite: true,
		secure: true
	});
};

export const coreDeleteFromExternalStorage = async (publicId: string) => {
	return await cloudinary.v2.uploader.destroy(publicId);
};

export const coreUploadMultipleFiles = (
	fileSizeLimit: number,
	filesNumberLimit: number,
	allowedMimeTypes: string[],
	storagePath: string,
	fieldName: string
) => {
	return multer({
		storage: storage(storagePath),
		limits: { fileSize: fileSizeLimit, files: filesNumberLimit },
		fileFilter: fileFilter(allowedMimeTypes)
	}).array(fieldName);
};

export const coreRemoveFile = async (path: string) => {
	if (existsSync(path)) {
		await unlink(path);
	}
};

export const coreCompressPicture = (inputPath: string): Promise<number> => {
	return new Promise(async (resolve, reject) => {
		const ffmpegExecutable = await testFfmpegExecutable();
		if (!ffmpegExecutable) {
			reject(new Error('ffmpeg not found'));
		}

		const tempDir = path.join(path.dirname(inputPath), '_compressing');
		const tempPath = path.join(tempDir, path.basename(inputPath));

		await mkdir(tempDir, {
			recursive: true
		});

		const subprocess = spawn(
			'ffmpeg',
			[
				'-i',
				inputPath,
				'-an',
				'-vframes',
				'1',
				'-filter:v',
				'scale=120:-1',
				`${tempPath}__preview.jpg`
			],
			{ stdio: 'pipe' }
		);

		subprocess.on('close', async code => {
			if (code === 0) {
				await rename(
					`${tempPath}__preview.jpg`,
					path.join(
						path.dirname(inputPath),
						`${path.basename(tempPath)}__preview.jpg`
					)
				);
				resolve(code);
				return;
			}
			reject(new Error('ffmpeg error'));
		});

		subprocess.on('error', err => {
			reject(err);
		});
	});
};
