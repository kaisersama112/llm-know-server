# coding=utf-8
"""
    @project: LLM-Know
    @Author：PanShangGuo
    @file： equal_compare.py
    @date：2024/6/7 14:44
    @desc:
"""
from typing import List

from application.flow.compare import Compare


class EqualCompare(Compare):

    def support(self, node_id, fields: List[str], source_value, compare, target_value):
        if compare == 'eq':
            return True

    def compare(self, source_value, compare, target_value):
        return str(source_value) == str(target_value)
