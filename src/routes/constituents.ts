import Router from 'koa-router';
import * as constituentService from '../services/constituentService';
import { createObjectCsvStringifier } from 'csv-writer';
import { Readable } from 'stream';

// import * as combinedStream from 'combined-stream';

interface ConstituentRequestBody {
    email: string;
    name: string;
    address: string;
    signUpTime: string;
}

const router = new Router();

router.get('/constituents', async (ctx) => {
    const constituents = constituentService.getAllConstituents();
    ctx.body = constituents;
});

router.post('/constituents', async (ctx) => {
    const { email, name, address, signUpTime } = ctx.request.body as ConstituentRequestBody;
    if (!email || !name || !address || !signUpTime) {
        ctx.throw(400, 'Missing required fields');
    }

    const newConstituent = {
        email,
        name,
        address,
        signUpTime: new Date(signUpTime),
    };

    constituentService.addConstituent(newConstituent);
    ctx.status = 201;
});

router.get('/constituents/export', async (ctx) => {
    try {
        const constituents = constituentService.getAllConstituents();
    
        const header = [
          { id: 'email', title: 'Email' },
          { id: 'name', title: 'Name' },
          { id: 'address', title: 'Address' },
          { id: 'signUpTime', title: 'Sign Up Time' },
        ];

        const csvStringifier = createObjectCsvStringifier({ header });

        ctx.set('Content-Type', 'text/csv');
        ctx.set('Content-Disposition', 'attachment; filename=constituents.csv');
    
        const totalConstituents = constituentService.getTotalConstituents();
        let offset = 0;
        const chunkSize = 1; // Adjust chunk size as needed

        const csvStream = new Readable({
            async read() {
              while (offset < totalConstituents) {
                const constituents = constituentService.getConstituentsChunk(offset, chunkSize);
                const csvData = constituents.map(constituent => csvStringifier.stringifyRecords([constituent])).join('\n');
                this.push(csvData);
                offset += chunkSize;
      
                // Pause the stream if there are more constituents to fetch
                if (offset < totalConstituents) {
                  this.pause();
                  await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay to prevent overwhelming the database
                  this.resume();
                }
              }
              this.push(null); // End of stream
            }
          });

        csvStream.on('end', () => {
            console.log('Stream ended');
            ctx.res.end(); // End the response stream
          });
    
        ctx.body = csvStream;
    
        // const csvStringifier = createObjectCsvStringifier({ header });
    
        // ctx.set('Content-Type', 'text/csv');
        // ctx.set('Content-Disposition', 'attachment; filename=constituents.csv');
    
        // ctx.body = csvStringifier.getHeaderString() + '\n' +
        //            constituents.map(constituent => csvStringifier.stringifyRecords([constituent])).join('\n');
      } catch (error) {
        console.error('Export CSV error:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error';
      }
    // try {

    // const constituents = constituentService.getAllConstituents();

    // const header = [
    //     { id: 'email', title: 'Email' },
    //     { id: 'name', title: 'Name' },
    //     { id: 'address', title: 'Address' },
    //     { id: 'signUpTime', title: 'Sign Up Time' },
    //   ];
    
    //   const csvStringifier = createObjectCsvStringifier({ header });

    //   ctx.set('Content-Type', 'text/csv');
    //   // ctx.set('Content-Disposition', 'attachment; filename=constituents.csv');
    //   ctx.attachment('constituents.csv'); // Set filename for download

    //   const csvStream = new PassThrough();
    //   csvStream.pipe(ctx.res);
    
    //   const chunkSize = 1000; // Number of constituents per chunk
    //   let index = 0;
    
    //   function pushChunk() {
    //     while (index < constituents.length && index < (chunkSize + index)) {
    //       const chunk = constituents.slice(index, index + chunkSize);
    //       const csvData = chunk.map(constituent => csvStringifier.stringifyRecords([constituent])).join('\n');
    //       csvStream.write(csvData);
    //       index += chunkSize;

    //       console.log(csvData);
    //     }
    
    //     if (index >= constituents.length) {
    //         console.log('ddddd, end')
    //       csvStream.end(); // End of stream
    //     } else {
    //         console.log('eeeee')
    //       if (!ctx.res.writableEnded) {
    //         // Wait for the drain event to continue pushing chunks
    //         csvStream.once('drain', pushChunk);
    //       }
    //     }
    //   }
    
    //   csvStream.on('error', (err) => {
    //     console.error('Stream error:', err);
    //     ctx.res.end();
    //   });
    
    //   pushChunk();
    // } catch (error) {
    //     console.error('Export CSV error:', error);
    //     ctx.status = 500;
    //     ctx.body = 'Internal Server Error';
    //   }

});

export default router;