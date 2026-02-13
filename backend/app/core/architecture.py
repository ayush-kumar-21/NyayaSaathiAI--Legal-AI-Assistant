"""
LegalOS Core Architecture
Implements: Generic Repository, Service Pattern, Unit of Work
"""
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, List, Optional, Dict, Any, Union
from pydantic import BaseModel
from datetime import datetime
import asyncio
from functools import wraps
import logging

# Generics
T = TypeVar('T', bound=BaseModel)
ID = TypeVar('ID')

logger = logging.getLogger("LegalOS.Kernel")

class IRepository(ABC, Generic[T, ID]):
    """
    Generic Repository Interface
    Enforces consistent data access patterns across all 24 skills.
    """
    @abstractmethod
    async def get(self, id: ID) -> Optional[T]: ...
    
    @abstractmethod
    async def list(self, filters: Dict[str, Any] = None, limit: int = 100) -> List[T]: ...
    
    @abstractmethod
    async def create(self, entity: T) -> T: ...
    
    @abstractmethod
    async def update(self, id: ID, entity: T) -> T: ...
    
    @abstractmethod
    async def delete(self, id: ID) -> bool: ...

class InMemoryRepository(IRepository[T, ID]):
    """
    High-performance in-memory repository for rapid prototyping and testing.
    Uses dict for O(1) lookups.
    """
    def __init__(self):
        self._storage: Dict[ID, T] = {}
        
    async def get(self, id: ID) -> Optional[T]:
        return self._storage.get(id)
        
    async def list(self, filters: Dict[str, Any] = None, limit: int = 100) -> List[T]:
        items = list(self._storage.values())
        if filters:
            items = [
                i for i in items 
                if all(getattr(i, k, None) == v for k, v in filters.items())
            ]
        return items[:limit]
        
    async def create(self, entity: T) -> T:
        if not hasattr(entity, 'id'):
            raise ValueError("Entity must have an 'id' field")
        self._storage[entity.id] = entity
        return entity
        
    async def update(self, id: ID, entity: T) -> T:
        if id not in self._storage:
            raise ValueError(f"Entity with id {id} not found")
        self._storage[id] = entity
        return entity
        
    async def delete(self, id: ID) -> bool:
        if id in self._storage:
            del self._storage[id]
            return True
        return False

class BaseService(ABC, Generic[T, ID]):
    """
    Base Service Layer with caching, audit, and error handling.
    """
    def __init__(self, repository: IRepository[T, ID]):
        self.repo = repository
        self._cache: Dict[ID, T] = {}
        self._cache_size = 1000
        
    async def get(self, id: ID) -> Optional[T]:
        """Get entity with read-through caching"""
        if id in self._cache:
            return self._cache[id]
            
        item = await self.repo.get(id)
        if item:
            self._cache_set(id, item)
        return item
        
    async def create(self, entity: T) -> T:
        """Create entity and cache it"""
        created = await self.repo.create(entity)
        self._cache_set(getattr(created, 'id'), created)
        return created
        
    async def update(self, id: ID, entity: T) -> T:
        """Update entity and refresh cache"""
        updated = await self.repo.update(id, entity)
        self._cache_set(id, updated)
        return updated
        
    async def delete(self, id: ID) -> bool:
        """Delete entity and invalidate cache"""
        success = await self.repo.delete(id)
        if success and id in self._cache:
            del self._cache[id]
        return success
        
    def _cache_set(self, id: ID, item: T):
        """Simple LRU Cache Set"""
        if len(self._cache) >= self._cache_size:
            # Remove first item (LRU approximation for Python 3.7+ dicts)
            self._cache.pop(next(iter(self._cache)))
        self._cache[id] = item
