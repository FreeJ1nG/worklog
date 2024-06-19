import fsp from 'node:fs/promises';
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

import {
  getNewId,
  readAndWriteJson,
  replaceFileContent,
} from './src/utils/fs.js';

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cors());

app.post(
  '/admin/reset',
  asyncHandler(async (_req, res) => {
    try {
      await replaceFileContent(
        path.resolve(__dirname, './src/data/logs.json'),
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
    const logsJsonStr = await fsp.readFile(
      path.resolve(__dirname, './src/data/logs.json'),
      { encoding: 'utf8' },
    );
    let logs = JSON.parse(logsJsonStr) as LogJsonEntrySchema[];
    logs = logs.filter(
      (log) => log.startTime <= queryParams.endTime
      && log.endTime >= queryParams.startTime,
    );
    res.status(200).send({ data: logs });
  }),
);

app.post(
  '/logs',
  asyncHandler(async (req, res) => {
    const { success, data: logs } = logSchema.safeParse(req.body);
    if (!success) {
      res.status(400).send({
        message: 'Unable to parse body, please check your request body',
      });
      return;
    }
    const data = await readAndWriteJson(
      './src/data/logs.json',
      async (oldJsonContent: LogJsonEntrySchema[]) => {
        return [
          ...oldJsonContent,
          { ...logs, id: await getNewId('./src/data/logs.json') },
        ];
      },
    );
    res.status(200).send({ data });
  }),
);

app.delete(
  '/logs/:logId',
  asyncHandler(async (req, res) => {
    const { success, data: params } = logIdParamSchema.safeParse(req.params);
    if (!success) {
      res.status(400).send({
        message:
          'Unable to parse logId parameter, are you sure the parameter is there?',
      });
      return;
    }
    const data = await readAndWriteJson(
      './src/data/logs.json',
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
    const { success: logIdParamSchemaSuccess, data: params }
      = logIdParamSchema.safeParse(req.params);
    if (!logIdParamSchemaSuccess) {
      res.status(400).send({
        message:
          'Unable to parse logId parameter, are you sure the parameter is there?',
      });
      return;
    }
    const { success: logSchemaSuccess, data: logs } = logSchema.safeParse(
      req.body,
    );
    if (!logSchemaSuccess) {
      res.status(400).send({
        message:
          "Unable to parse request body, are you sure it's passing the correct data?",
      });
      return;
    }
    const data = await readAndWriteJson(
      './src/data/logs.json',
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
