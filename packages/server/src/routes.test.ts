import request from 'supertest';
import app from './server.ts';
import {createCardCreationEvent, CardType, type Card} from "@habilis/core";


test("health endpoint works", async () => {
    const response = await request(app.callback()).get("/healthz");
    expect(response.status).toBe(200);
    expect(response.text).toBe("OK");
});
test('Can create a card', async () => {
  const testCardText = "{{Hello}} test {{test}}";
    const response = await request(app.callback()).post('/api/v1/card')
      .send(createCardCreationEvent(CardType.Cloze, testCardText))
      .type("json")
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    
    const { id, lastEventId, userId, type, isDeleted, cardText, schedulingInfo, attachments} = response.body[0] as Card;
    expect(id).not.toBeUndefined();
    expect(lastEventId).not.toBeUndefined();
    expect(userId).toBe("TODO");
    expect(type).toBe(CardType.Cloze);
    expect(isDeleted).toBe(false);
    expect(cardText).toBe(testCardText);
    expect(schedulingInfo).toHaveLength(2);
    expect(attachments).toHaveLength(0);
});