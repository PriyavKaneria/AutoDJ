import aioredis
from aioredis import Redis

redis : Redis = None

async def get_redis() -> aioredis.Redis:
    global redis
    if not redis:
        redis = await aioredis.from_url("redis://localhost", encoding="utf-8", decode_responses=True)

    return redis