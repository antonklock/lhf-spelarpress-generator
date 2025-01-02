import updatePlayerPresso from './main.ts';

const handler = (async (req: Request) => {
    if (req.url.endsWith("/update")) {
        return updateHandler(req);
    } else {
        const html = await Deno.readFile("index.html");
        return new Response(html, {
            headers: {
                "content-type": "text/html",
            },
        });
    }
});

const updateHandler = async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const formData = await req.formData();

        // Extract form fields
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const number = formData.get('number') as string;

        // Extract files
        const portrait = formData.get('portrait') as File;
        const front = formData.get('front') as File;
        const back = formData.get('back') as File;

        if (!firstName || !lastName || !number || !portrait || !front || !back) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Clear uploads directory
        try {
            for (const entry of Deno.readDirSync('./uploads')) {
                await Deno.remove(`./uploads/${entry.name}`);
            }
        } catch (error) {
            console.error('Error clearing uploads directory:', error);
        }

        // Save files to disk
        const portraitPath = `./uploads/${portrait.name}`;
        const frontPath = `./uploads/${front.name}`;
        const backPath = `./uploads/${back.name}`;

        await Deno.writeFile(portraitPath, new Uint8Array(await portrait.arrayBuffer()));
        await Deno.writeFile(frontPath, new Uint8Array(await front.arrayBuffer()));
        await Deno.writeFile(backPath, new Uint8Array(await back.arrayBuffer()));

        // Get absolute file paths
        const portraitFullPath = await Deno.realPath(portraitPath);
        const frontFullPath = await Deno.realPath(frontPath);
        const backFullPath = await Deno.realPath(backPath);

        const updateProps = {
            firstName,
            lastName,
            number,
            images: {
                portrait: portraitFullPath,
                front: frontFullPath,
                back: backFullPath
            }
        };

        console.log("UPDATE_PROPS: ", updateProps);
        updatePlayerPresso(updateProps);

        return new Response(JSON.stringify({ message: 'Files uploaded successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

Deno.serve({ port: 8080, hostname: "0.0.0.0" }, handler);