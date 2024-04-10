import Router from 'koa-router';
import * as constituentManager from '../managers/constituents';
import { createObjectCsvStringifier } from 'csv-writer';
import { Readable } from 'stream';

interface ConstituentRequestBody {
    email: string;
    name: string;
    address: string;
    signUpTime: string;
}

const router = new Router();

router.get('/constituents', async (ctx) => {
    // @todo add validation for page and size
    const page = ctx.query.page && parseInt(ctx.query.page as string) || 1;
    const size = ctx.query.size && parseInt(ctx.query.size as string) || 10;
    const offset = (page - 1) * size;

    const constituents = constituentManager.getConstituentsChunk(offset, size);
    ctx.body = constituents;
});

router.post('/constituents', async (ctx) => {
    const { email, name, address, signUpTime } = ctx.request.body as ConstituentRequestBody;
    if (!email || !name || !address || !signUpTime) {
        ctx.throw(400, 'Missing required fields');
    }
    // @todo add more validation on ConstituentModel within addConstituent manager

    const newConstituent = {
        email,
        name,
        address,
        signUpTime: new Date(signUpTime),
    };

    constituentManager.addConstituent(newConstituent);
    ctx.status = 201;
});

router.get('/constituents/export', async (ctx) => {
    // @todo move logic into manager
    try {
        const header = [
            { id: 'email', title: 'Email' },
            { id: 'name', title: 'Name' },
            { id: 'address', title: 'Address' },
            { id: 'signUpTime', title: 'Sign Up Time' },
        ];

        const csvStringifier = createObjectCsvStringifier({ header });

        ctx.set('Content-Type', 'text/csv');
        ctx.set('Content-Disposition', 'attachment; filename=constituents.csv');

        const totalConstituents = constituentManager.getTotalConstituents();
        let offset = 0;
        const chunkSize = 1;

        const csvStream = new Readable({
            async read() {
                while (offset < totalConstituents) {
                    const constituents = constituentManager.getConstituentsChunk(offset, chunkSize);
                    const csvData = constituents.map(constituent => csvStringifier.stringifyRecords([constituent])).join('\n');
                    this.push(csvData);
                    offset += chunkSize;

                    // Pause the stream if there are more constituents to fetch
                    if (offset < totalConstituents) {
                        this.pause();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        this.resume();
                    }
                }
                this.push(null);
            }
        });

        csvStream.on('end', () => {
            console.log('Stream ended');
            ctx.res.end();
        });

        ctx.body = csvStream;

    } catch (error) {
        console.error('Export CSV error:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
    }

});

export default router;