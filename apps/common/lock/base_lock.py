# coding=utf-8
"""
    @project: LLM-Know
    @Author：PanShangGuo
    @file： base_lock.py
    @date：2024/8/20 10:33
    @desc:
"""

from abc import ABC, abstractmethod


class BaseLock(ABC):
    @abstractmethod
    def try_lock(self, key, timeout):
        pass

    @abstractmethod
    def un_lock(self, key):
        pass
