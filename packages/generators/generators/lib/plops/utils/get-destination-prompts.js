'use strict';
const { join } = require('path');
const fs = require('fs-extra');

module.exports = (action, basePath) => {
  return [
    {
      type: 'list',
      name: 'destination',
      message: `Where do you want to add this ${action}?`,
      choices: [
        {
          name: `Add ${action} to ${action === 'policy' ? 'root of project' : 'new API'}`,
          value: 'new',
        },
        { name: `Add ${action} to an existing API`, value: 'api' },
        { name: `Add ${action} to an existing plugin`, value: 'plugin' },
      ],
    },
    {
      when: answers => answers.destination === 'api',
      type: 'list',
      message: 'Which API is this for?',
      name: 'api',
      choices: async () => {
        const apiPath = join(basePath, 'api');
        const exists = await fs.pathExists(apiPath);

        if (!exists) {
          throw Error('Couldn\'t find an "api" directory');
        }

        const apiDir = await fs.readdir(apiPath, { withFileTypes: true });
        const apiDirContent = apiDir.filter(fd => fd.isDirectory());

        if (apiDirContent.length === 0) {
          throw Error('The "api" directory is empty');
        }

        return apiDirContent;
      },
    },
    {
      when: answers => answers.destination === 'plugin',
      type: 'list',
      message: 'Which plugin is this for?',
      name: 'plugin',
      choices: async () => {
        const pluginsPath = join(basePath, 'plugins');
        const exists = await fs.pathExists(pluginsPath);

        if (!exists) {
          throw Error('Couldn\'t find a "plugins" directory');
        }

        const pluginsDir = await fs.readdir(pluginsPath);
        const pluginsDirContent = pluginsDir.filter(api =>
          fs.lstatSync(join(pluginsPath, api)).isDirectory()
        );

        if (pluginsDirContent.length === 0) {
          throw Error('The "plugins" directory is empty');
        }

        return pluginsDirContent;
      },
    },
  ];
};