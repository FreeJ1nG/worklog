import path from 'node:path';

import cors from 'cors';
import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  getLogsQueryParamSchema,
  logIdParamSchema,
  type LogJsonEntrySchema,
  logSchema,
} from 'worklog-shared';

import { WHITELISTED_SERVICES } from './src/constants/whitelist.js';
import {
  getNewId,
  readAndWriteJson,
  readJsonFile,
  replaceFileContent,
} from './src/utils/fs.js';
import { parseWithSchema } from './src/utils/http.js';

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  if (
    WHITELISTED_SERVICES.some(({ method, url }) => req.method === method && url instanceof RegExp
      ? url.test(req.url)
      : url === req.url)
  ) {
    next();
    return;
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader?.split(' ').length < 2) {
    res.status(401).send({
      message: 'Invalid authorization header, are you sure you have signed in?',
    });
    return;
  }
  const [, sessionId] = authHeader.split(' ');
  readJsonFile<Record<string, string>>('./src/datasource/sessions.json')
    .then((sessions) => {
      if (!Object.values(sessions).some((id) => id === sessionId)) {
        res.status(401).send({
          message: 'Invalid sessionId, are you sure you have signed in?',
        });
        return;
      }
      next();
    })
    .catch(() => {
      res.status(500).send({
        message:
          'Something went wrong while trying to validate sessionId, please contact system admin',
      });
    });
});

app.get(
  '/me',
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader?.split(' ').length < 2) {
      res.status(401).send({
        message:
          'Invalid authorization header, are you sure you have signed in?',
      });
      return;
    }
    const [, sessionId] = authHeader.split(' ');
    try {
      const sessions = await readJsonFile<Record<string, string>>(
        './src/datasource/sessions.json',
      );
      for (const username of Object.keys(sessions)) {
        const id = sessions[username];
        if (id === sessionId) {
          res.status(200).send({ data: { username } });
          return;
        }
      }
    }
    catch (e) {
      res.status(401).send({
        message:
          'Unable to validate sessionId, are you sure you are signed in?',
      });
    }
  }),
);

app.post(
  '/admin/reset',
  asyncHandler(async (_req, res) => {
    try {
      await replaceFileContent(
        path.resolve(__dirname, './src/datasource/logs.json'),
        '[]',
      );
      res
        .status(200)
        .send({ message: 'Successfully deleted logs.json content' });
    }
    catch (e) {
      console.error(e);
      res.status(500).send({ message: 'Unable to reset logs.json file' });
    }
  }),
);

app.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const { success, data: queryParams } = getLogsQueryParamSchema.safeParse(
      req.query,
    );
    if (!success) {
      res.status(400).send({
        message:
          'Unrecognized query parameters, are you sure you passed the right things?',
      });
      return;
    }
    let logs = await readJsonFile<LogJsonEntrySchema[]>(
      './src/datasource/logs.json',
    );
    logs = logs.filter(
      (log) => log.endTime >= queryParams.startTime
      && log.startTime <= queryParams.endTime,
    );
    res.status(200).send({ data: logs });
  }),
);

app.post(
  '/logs',
  asyncHandler(async (req, res) => {
    const logs = parseWithSchema(logSchema, req.body);
    if (!logs) {
      res.status(400).send({
        message: 'Unable to parse body, please check your request body',
      });
      return;
    }
    const data = await readAndWriteJson(
      './src/datasource/logs.json',
      async (oldJsonContent: LogJsonEntrySchema[]) => {
        return [
          ...oldJsonContent,
          { ...logs, id: await getNewId('./src/datasource/logs.json') },
        ];
      },
    );
    res.status(200).send({ data });
  }),
);

app.delete(
  '/logs/:logId',
  asyncHandler(async (req, res) => {
    const params = parseWithSchema(logIdParamSchema, req.params);
    if (!params) {
      res.status(400).send({
        message:
          'Unable to parse logId parameter, are you sure the parameter is there?',
      });
      return;
    }
    const data = await readAndWriteJson(
      './src/datasource/logs.json',
      (oldJsonContent: LogJsonEntrySchema[]) => {
        return oldJsonContent.filter(({ id }) => id !== params.logId);
      },
    );
    res.status(200).send({ data });
  }),
);

app.put(
  '/logs/:logId',
  asyncHandler(async (req, res) => {
    const params = parseWithSchema(logIdParamSchema, req.params);
    if (!params) {
      res.status(400).send({
        message:
          'Unable to parse logId parameter, are you sure the parameter is there?',
      });
      return;
    }
    const logs = parseWithSchema(logSchema, req.body);
    if (!logs) {
      res.status(400).send({
        message:
          "Unable to parse request body, are you sure it's passing the correct data?",
      });
      return;
    }
    const data = await readAndWriteJson(
      './src/datasource/logs.json',
      (oldJsonContent: LogJsonEntrySchema[]) => {
        return [
          ...oldJsonContent.filter(({ id }) => id !== params.logId),
          { ...logs, id: params.logId },
        ].sort((a, b) => a.id - b.id);
      },
    );
    res.status(200).send({ data });
  }),
);

app.listen(8080);
console.log('Listening on port 8080 ...');
