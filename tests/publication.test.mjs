import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { isPublishable } from '../src/lib/publication.mjs';
import { duePosts, needsPublication } from '../scripts/should-publish.mjs';

const now=Date.parse('2026-10-24T12:00:00+09:00');
test('draft takes priority; scheduled posts are withheld until their timestamp',()=>{
  assert.equal(isPublishable({draft:false},now),true);
  assert.equal(isPublishable({draft:true,publishAt:'2026-10-24T11:00:00+09:00'},now),false);
  assert.equal(isPublishable({draft:false,publishAt:'2026-10-24T12:01:00+09:00'},now),false);
  assert.equal(isPublishable({draft:false,publishAt:'2026-10-24T12:00:00+09:00'},now),true);
  assert.equal(isPublishable({draft:false,publishAt:'invalid'},now),false);
});
test('scheduled scan and published manifest handle due, future, and failed publication retries',async()=>{
  const root=path.resolve('../../work/schedule-fixture-'+Date.now());await fs.mkdir(root,{recursive:true});
  try{
    await fs.writeFile(path.join(root,'due.md'),'---\r\ntitle: Test\r\npublishAt: "2026-10-24T11:59:00+09:00"\r\ndraft: false\r\n---\r\nHello');
    await fs.writeFile(path.join(root,'future.md'),'---\ntitle: Test\npublishAt: 2026-10-24T12:01:00+09:00\n---\n');
    await fs.writeFile(path.join(root,'draft.md'),'---\ntitle: Test\npublishAt: 2026-10-24T11:59:00+09:00\ndraft: true\n---\n');
    const due=await duePosts(root,now);assert.deepEqual(due.map(p=>p.id),['due']);
    assert.equal(needsPublication(due,null),true);
    assert.equal(needsPublication(due,{builtAt:'2026-10-24T11:00:00+09:00',posts:['due']}),true);
    assert.equal(needsPublication(due,{builtAt:'2026-10-24T12:00:00+09:00',posts:[]}),true);
    assert.equal(needsPublication(due,{builtAt:'2026-10-24T12:00:00+09:00',posts:['due']}),false);
    assert.equal(needsPublication([],null),false);
  }finally{for(const file of ['due.md','future.md','draft.md'])await fs.rm(path.join(root,file),{force:true});await fs.rmdir(root)}
});
