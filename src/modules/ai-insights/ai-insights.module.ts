import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiInsightsService } from './ai-insights.service';
import { AiInsightsController } from './ai-insights.controller';
import { AiInsight, AiInsightSchema } from './schemas/ai-insight.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiInsight.name, schema: AiInsightSchema },
    ]),
  ],
  controllers: [AiInsightsController],
  providers: [AiInsightsService],
  exports: [AiInsightsService],
})
export class AiInsightsModule {}
