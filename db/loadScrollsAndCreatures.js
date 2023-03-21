import postgres from "postgres"
import { config } from "./config.js"

export async function loadScrollsAndCreatures(){
    const sql = postgres(config.db)
    
    const dbScrolls = await sql`
        select id, creature_name, unlocks from mints where is_scroll=TRUE AND project='inferno';
      `
    const dbCreatures = await sql`
      select id, name, parents, gen from mints where is_creature=TRUE AND project='inferno';
    `
    const creature_fragments = await sql`
        select creature_id, fragment_id from creature_fragments;
    `
    
    sql.end()

    const scrolls = dbScrolls.map(s=>{return {id: s.id, name:s.creature_name, fId: s.unlocks}})
    const creatures = dbCreatures.map(c =>{
      return{
        id: +c.id,
        name: c.name,
        parent1: c.parents?.split(' ')[0]??null,
        parent2: c.parents?.split(' ')[1]??null,
        gen: c.gen??0,
        fragments: creature_fragments.filter(cf=> cf.creature_id == c.id).map(x => x.fragment_id)
      }
    })

    return {
        scrolls,
        creatures,
    }
}

export async function loadWoodenScrollsAndCreatures(){
  const sql = postgres(config.db)
  
  const dbScrolls = await sql`
      select id, creature_name, unlocks from mints where is_scroll=TRUE AND project='wooden';
    `
  const dbCreatures = await sql`
    select id, name, parents, gen from mints where is_creature=TRUE AND project='wooden';
  `
  const creature_fragments = await sql`
      select creature_id, fragment_id from creature_fragments;
  `
  
  sql.end()

  const scrolls = dbScrolls.map(s=>{return {id: s.id, name:s.creature_name, fId: s.unlocks}})
  const creatures = dbCreatures.map(c =>{
    return{
      id: +c.id,
      name: c.name,
      parent1: c.parents?.split(' ')[0]??null,
      parent2: c.parents?.split(' ')[1]??null,
      gen: c.gen??0,
      fragments: creature_fragments.filter(cf=> cf.creature_id == c.id).map(x => x.fragment_id)
    }
  })

  return {
      scrolls,
      creatures,
  }
}