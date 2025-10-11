# coding=utf-8
"""
    @project: LLM-Know
    @Author：PanShangGuo
    @file： lt_compare.py
    @date：2024/6/11 9:52
    @desc: 大于比较器
"""
from typing import List

from application.flow.compare import Compare


class LenGECompare(Compare):

    def support(self, node_id, fields: List[str], source_value, compare, target_value):
        if compare == 'len_ge':
            return True

    def compare(self, source_value, compare, target_value):
        try:
            return len(source_value) >= int(target_value)
        except Exception as e:
            return False
