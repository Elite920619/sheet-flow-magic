
export class BatchProcessor {
  static async processSportsBatches<T>(
    sports: any[], 
    batchSize: number, 
    processBatch: (batch: any[]) => Promise<T[]>,
    delay: number = 200
  ): Promise<T[]> {
    const allResults: T[] = [];
    
    for (let i = 0; i < sports.length; i += batchSize) {
      const batch = sports.slice(i, i + batchSize);
      console.log(`Processing events batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(sports.length/batchSize)}`);
      
      const batchResults = await processBatch(batch);
      // batchResults is already T[], so we can spread it directly
      if (batchResults.length > 0) {
        allResults.push(...batchResults);
      }
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < sports.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return allResults;
  }
}
