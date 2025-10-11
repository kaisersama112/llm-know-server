# coding=utf-8
"""
    @project: LLM-Know
    @Author：PanShangGuo
    @file： is_null_compare.py
    @date：2024/6/28 10:45
    @desc:
"""
from typing import List

from application.flow.compare import Compare


class IsNullCompare(Compare):

    def support(self, node_id, fields: List[str], source_value, compare, target_value):
        if compare == 'is_null':
            return True

    def compare(self, source_value, compare, target_value):
        return source_value is None or len(source_value) == 0
