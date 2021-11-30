import childProcess from 'node:child_process';

export default async function remoteGitTags(repoUrl) {
	return new Promise((resolve, reject) => {
		const process = childProcess.execFile('git', ['ls-remote', '--tags', repoUrl], (error, stdout) => {
			console.log(process.pid, '=========pid==========');
			if (error) {
				reject(error);
			}

			const tags = new Map();
			for (const line of stdout.trim().split('\n')) {
				const [hash, tagReference] = line.split('\t');
				// Strip off the indicator of dereferenced tags so we can override the
				// previous entry which points at the tag hash and not the commit hash
				// `refs/tags/v9.6.0^{}` → `v9.6.0`
				const tagName = tagReference.replace(/^refs\/tags\//, '').replace(/\^{}$/, '');

				tags.set(tagName, hash);
			}

			resolve(tags);
		});
	});
}
