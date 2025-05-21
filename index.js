const core = require('@actions/core');
const github = require('@actions/github');
const fs = require("fs")

const main = async () => {
    if (github.context.eventName !== 'pull_request') {
        core.info('Skipping non-PR event');
        return;
    }

    const baseSha = github.context.payload.pull_request.base.sha;
    const headSha = github.context.payload.pull_request.head.sha;

    const baseUrl = `https://raw.githubusercontent.com/${ github.context.repo.owner }/${ github.context.repo.repo }/${ baseSha }/${ packageJsonPath }`

    const localVersionRaw = fs.readFileSync(`${ process.env.GITHUB_WORKSPACE }/version.txt`)
    const localVersion = parseInt(localVersionRaw);

    const res = await fetch(baseUrl, { headers })
    const versionRaw = await res.text()
    const version = parseInt(versionRaw);

    console.log("Comparing", {
        baseSha,
        headSha,
        targetVersion: version,
        localVersion: localVersion,
    })

    if (version <= localVersion) {
        throw new Error("Version mismatch: Expected version to be higher.")
    }
}

const run = async () => {
    try {
        await main()
    } catch(e) {
        core.setFailed(e)
    }
}

run()