import { Guilds, Roles } from '@kaelbot/constants';
import { UserDocument, DocumentResponse } from '@kaelbot/database';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

import { Client } from '@interfaces';

function sortAndLimitDevelopers(
  sort: Record<string, any>,
  limit = 5,
): Promise<DocumentResponse<UserDocument>[]> {
  const client = container.resolve<Client>(Namespace.Client);
  const guild = client.guilds.cache.get(Guilds.Developer);

  let developers: string[] = [];

  if (guild) {
    developers = guild.members.cache
      .filter(member => member.roles.cache.has(Roles.Developer))
      .map(({ id }) => id);
  }

  return client.database.users.sortAndLimit(sort, limit, {
    _id: { $nin: developers },
  });
}

export default sortAndLimitDevelopers;
